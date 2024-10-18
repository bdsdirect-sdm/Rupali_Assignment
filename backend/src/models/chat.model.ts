
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Chat extends Model {
  public id!: number;
  public senderId!: number;
  public receiverId!: number;
  public message!: string;
  public readonly createdAt!: Date;
}

Chat.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Chat',
  }
);

export default Chat;
