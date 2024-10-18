
import { DataTypes, Model } from "sequelize"; 
import sequelize from "../config/db";

class User extends Model {
  public id!: number; 
  public firstName!: string;
  public lastName!: string;
  public email!: string; 
  public phone!: string;
  public gender!: string;
  public userType!: string;
  public profileImage!: string;
  public resume?: string;
  public password!: string;
  public agencyId?: number;
  public hobbies?: string[];
  public token?: string; 
  public requestStatus!: 'pending' | 'accepted' | 'declined'; 
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public status!: any;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, 
        len: [2, 50], 
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 15], 
      },
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Male', 'Female', 'Other']], 
      },
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Job Seeker', 'Agency']], 
      },
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    resume: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    agencyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 100], 
      },
    },
    hobbies: { 
      type: DataTypes.JSON, 
      allowNull: true,
    },
    token: { 
      type: DataTypes.STRING,
      allowNull: true, 
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending', 
  },
  
  },
  {
    sequelize,
    modelName: 'User',
  }
);

export default User;

