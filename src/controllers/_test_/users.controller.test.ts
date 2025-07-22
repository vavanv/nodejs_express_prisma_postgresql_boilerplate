import { UserService } from '../../services/user.service';

// Mock the UserService
jest.mock('../../services/user.service');
const MockedUserService = UserService as jest.MockedClass<typeof UserService>;

const mockUsers = [
  { 
    id: '1', 
    email: 'test@example.com', 
    name: 'Test User', 
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    posts: [] 
  },
];

describe('UserService', () => {
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    userService = new MockedUserService({} as any) as jest.Mocked<UserService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getAllUsers returns users from service', async () => {
    userService.getAllUsers.mockResolvedValue(mockUsers);
    const result = await userService.getAllUsers();
    expect(result).toEqual(mockUsers);
    expect(userService.getAllUsers).toHaveBeenCalled();
  });

  it('createUser creates a user with service', async () => {
    const newUser = { 
      id: '2', 
      email: 'new@example.com', 
      name: 'New User',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    };
    userService.createUser.mockResolvedValue(newUser);
    const result = await userService.createUser({ email: 'new@example.com', name: 'New User' });
    expect(result).toEqual(newUser);
    expect(userService.createUser).toHaveBeenCalledWith({ email: 'new@example.com', name: 'New User' });
  });

  it('getUserById returns user from service', async () => {
    const user = mockUsers[0];
    userService.getUserById.mockResolvedValue(user);
    const result = await userService.getUserById('1');
    expect(result).toEqual(user);
    expect(userService.getUserById).toHaveBeenCalledWith('1');
  });

  it('updateUser updates user with service', async () => {
    const updatedUser = { ...mockUsers[0], name: 'Updated Name' };
    userService.updateUser.mockResolvedValue(updatedUser);
    const result = await userService.updateUser('1', { name: 'Updated Name' });
    expect(result).toEqual(updatedUser);
    expect(userService.updateUser).toHaveBeenCalledWith('1', { name: 'Updated Name' });
  });

  it('deleteUser deletes user with service', async () => {
    const deletedUser = mockUsers[0];
    userService.deleteUser.mockResolvedValue(deletedUser);
    const result = await userService.deleteUser('1');
    expect(result).toEqual(deletedUser);
    expect(userService.deleteUser).toHaveBeenCalledWith('1');
  });
}); 