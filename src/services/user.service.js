import User from "../models/user";
import Setting from "../models/setting";
import FriendList from "../models/friendList";
import bcrypt from "bcrypt";

class UserService {
    async profile(userId) {
        const user = await User.findById(userId);
        const dob = user.dob;
        const day = dob.getUTCDate();
        const month = dob.getUTCMonth() + 1;
        const year = dob.getUTCFullYear();
        const dobFormated = `${day}-${month}-${year}`;
        return {
            ...user._doc,
            dob: dobFormated,
        };
    }

    async editProfile(userId, data) {
        const parts = data.dob.split('-');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return await User.findByIdAndUpdate(userId, {...data, dob: new Date(year, month, day)}, { new: true });
    }

    async follow(userId, friendId) {
        const user = await User.findById(friendId);
        if (!user) throw new Error("User not found");
        const friends = await FriendList.findOneAndUpdate(
            {
                user: userId,
                "friends.user": { $ne: friendId },
            },
            {
                $push: {
                    friends: {
                        user: user,
                        best_friend: false,
                    },
                },
            },
            {
                new: true,
                upsert: true,
            }
        );
        return friends;
    }

    async changePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        const password = user.password;
        if (!bcrypt.compareSync(currentPassword, password)) throw new Error("Password is incorrect");
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(newPassword, salt);
        return await user.save();
    }

    async unFollow(userId, friendId) {
        return await FriendList.findOneAndUpdate(
            {
                user: userId,
            },
            {
                $pull: {
                    friends: {
                        user: friendId,
                    },
                },
            },
        );
    }

    async getFollowers(userId) {
        const listFollowers = await FriendList.find({
            "friends.user": userId,
        }).populate("user");
        const result = [];
        listFollowers.map((e) => {
            result.push({
                id: e.user._id,
                username: e.user.username,
                firstname: e.user.firstName,
                lastname: e.user.lastName,
            });
        });
        return result;
        }

    async getFollowing(userId) {
        const ListFollowing = await FriendList.find({
            user: userId,
        }).populate("friends.user");
        const result = [];
        ListFollowing.map((e) => {
            e.friends.map((friend) => {
                result.push({
                    id: friend.user._id,
                    username: friend.user.username,
                    firstname: friend.user.firstName,
                    lastname: friend.user.lastName,
                });
            });
        });
        return result;
    }
}

export default new UserService();
