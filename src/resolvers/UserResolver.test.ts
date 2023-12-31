import { UserResolver, toUserType } from './UserResolver';
import { UserModel, IUser } from '@models/User';
import {
  LoginInput,
  RegisterInput,
  UpdateUserInput,
  UserInput,
  UserType,
} from '@schema/UserType';
import mongoose from 'mongoose';

const createInput: RegisterInput = {
  email: 'test@test.com',
  password: 'password',
  firstName: 'Firsty',
  lastName: 'Lasty',
  address: '123 Main St',
  city: 'City',
  state: 'ST',
  zipcode: '12345',
};

// For named imports
jest.mock('@models/User', () => ({
  UserModel: jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findOne: jest.fn(),
    select: jest.fn(),
  })),
}));

jest.mock('@utils/security', () => ({
  generateToken: jest.fn().mockReturnValue('token'),
}));

// For default imports
// jest.mock('@models/User', () => {
//   return {
//     __esModule: true, // Required for ES6 modules
//     default: jest.fn().mockImplementation(() => ({
//       save: jest.fn(),
//       toObject: jest.fn(),
//       // ... other methods
//     })),
//   };
// });

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(() => {
    resolver = new UserResolver();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      // Arrange
      process.env = {
        JWT_SECRET: 'test',
      };

      const userId = new mongoose.Types.ObjectId().toString();
      const expectedUser = {
        id: userId,
        ...createInput,
      };

      const { password, ...expectedUserWithoutPassword } = expectedUser;

      const expectedResult = {
        ...expectedUserWithoutPassword,
        id: expectedUserWithoutPassword.id.toString(),
      };

      const mockUserInstance = {
        ...expectedUser,
        save: jest.fn(),
        toObject: jest.fn().mockReturnValue(expectedUser),
      };

      jest
        .spyOn(UserModel.prototype, 'constructor')
        .mockImplementation(() => mockUserInstance);

      // Act
      const result = await resolver.createUser(createInput);

      // Assert
      expect(UserModel.prototype.constructor).toHaveBeenCalledWith(createInput);
      expect(mockUserInstance.save).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('throws an error when creating a user fails', async () => {
      // Mock the UserModel instance
      const mockUserInstance = {
        save: jest.fn().mockRejectedValue(new Error('Save failed')),
        toObject: jest.fn(),
      };

      jest
        .spyOn(UserModel.prototype, 'constructor')
        .mockImplementation(() => mockUserInstance);

      await expect(resolver.createUser(createInput)).rejects.toThrow(
        'Save failed'
      );
    });
  });

  describe('updateUser', () => {
    it('should updates a user successfully', async () => {
      // Arrange
      const userId = new mongoose.Types.ObjectId().toString();
      const updateData: UpdateUserInput = {
        email: 'test@test.com',
        firstName: 'Firsty',
        lastName: 'Lasty',
      };

      const expectedUpdatedUser = {
        id: userId,
        ...updateData,
        toObject: () => ({
          id: userId,
          ...updateData,
        }),
      };

      UserModel.findByIdAndUpdate = jest
        .fn()
        .mockResolvedValueOnce(expectedUpdatedUser);

      // Act
      const result = await resolver.updateUser(userId, updateData);

      // Assert
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        updateData,
        {
          new: true,
        }
      );
      expect(result).toEqual(expectedUpdatedUser.toObject());
    });

    it('throws an error when the user to update is not found', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const updateData = {
        email: 'test@test.com',
        firstName: 'Firsty',
        lastName: 'Lasty',
      };
      UserModel.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await expect(resolver.updateUser(userId, updateData)).rejects.toThrow(
        'User not found'
      );
    });

    it('throws an error when updating a user fails', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const updateData: UpdateUserInput = {
        email: 'test@test.com',
        firstName: 'Firsty',
        lastName: 'Lasty',
      };

      UserModel.findByIdAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error('Update failed'));

      await expect(resolver.updateUser(userId, updateData)).rejects.toThrow(
        'Update failed'
      );
    });
  });

  describe('findAllUsers', () => {
    it('should find all users successfully', async () => {
      // Arrange
      const userData = {
        ...createInput,
      };

      const mockUser = {
        ...userData,
        toObject: () => ({
          ...userData,
        }),
      };

      const mockUsers = [mockUser];

      UserModel.find = jest.fn().mockResolvedValue(mockUsers);

      // Act
      const result = await resolver.users();

      // Assert
      expect(UserModel.find).toHaveBeenCalledWith();
      expect(result).toEqual(
        [userData].map((user) => toUserType(user as IUser))
      );
    });

    it('throws an error when fetching all users fails', async () => {
      UserModel.find = jest.fn().mockRejectedValue(new Error('Find failed'));

      await expect(resolver.users()).rejects.toThrow('Find failed');
    });
  });

  describe('findOneUser', () => {
    it('should find one user successfully', async () => {
      // Arrange
      const userId = new mongoose.Types.ObjectId().toString();
      const userData = {
        ...createInput,
      };

      const mockUser = {
        ...userData,
        toObject: () => ({
          ...userData,
        }),
      };

      UserModel.findById = jest.fn().mockResolvedValue(mockUser);

      // Act
      const result = await resolver.user(userId);

      // Assert
      expect(UserModel.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(toUserType(userData as IUser));
    });

    it('returns null when a single user is not found', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      UserModel.findById = jest.fn().mockResolvedValue(null);

      const result = await resolver.user(userId);

      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should delete one user successfully', async () => {
      // Arrange
      const userId = new mongoose.Types.ObjectId().toString();

      UserModel.findByIdAndDelete = jest.fn();

      // Act
      const result = await resolver.deleteUser(userId);

      // Assert
      expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
    });

    it('throws an error when deleting a user fails', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      UserModel.findByIdAndDelete = jest
        .fn()
        .mockRejectedValue(new Error('Delete failed'));

      await expect(resolver.deleteUser(userId)).rejects.toThrow(
        'Delete failed'
      );
    });
  });

  describe('registerUser', () => {
    it('should register a user', async () => {
      // Arrange
      process.env = {
        JWT_SECRET: 'test',
      };

      const userId = new mongoose.Types.ObjectId().toString();
      const expectedUser = {
        id: userId,
        ...createInput,
      };

      const { password, ...expectedUserWithoutPassword } = expectedUser;

      const expectedResult = {
        ...expectedUserWithoutPassword,
        id: expectedUserWithoutPassword.id.toString(),
      };

      const mockUserInstance = {
        ...expectedUser,
        save: jest.fn(),
        toObject: jest.fn().mockReturnValue(expectedUser),
      };

      jest
        .spyOn(UserModel.prototype, 'constructor')
        .mockImplementation(() => mockUserInstance);

      // Act
      const result = await resolver.register(createInput);

      const { token, ...resultWithoutToken } = result;

      // Assert
      expect(UserModel.prototype.constructor).toHaveBeenCalledWith(createInput);
      expect(mockUserInstance.save).toHaveBeenCalled();
      expect(resultWithoutToken).toEqual(expectedResult);
      expect(token).toBeDefined();
    });

    it('throws an error when registering a user fails', async () => {
      // Mock the UserModel instance
      const mockUserInstance = {
        save: jest.fn().mockRejectedValue(new Error('Register failed')),
        toObject: jest.fn(),
      };

      jest
        .spyOn(UserModel.prototype, 'constructor')
        .mockImplementation(() => mockUserInstance);

      await expect(resolver.register(createInput)).rejects.toThrow(
        'Register failed'
      );
    });
  });
});
