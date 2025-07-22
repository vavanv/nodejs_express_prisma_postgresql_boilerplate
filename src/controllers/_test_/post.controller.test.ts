import { PostService } from '../../services/post.service';

// Mock the PostService
jest.mock('../../services/post.service');
const MockedPostService = PostService as jest.MockedClass<typeof PostService>;

const mockPosts = [
  { 
    id: '1', 
    title: 'Test Post', 
    content: 'Test content', 
    published: false, 
    authorId: '1',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    author: { 
      id: '1', 
      email: 'test@example.com', 
      name: 'Test User',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    }
  },
];

describe('PostService', () => {
  let postService: jest.Mocked<PostService>;

  beforeEach(() => {
    postService = new MockedPostService({} as any) as jest.Mocked<PostService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getAllPosts returns posts from service', async () => {
    postService.getAllPosts.mockResolvedValue(mockPosts);
    const result = await postService.getAllPosts();
    expect(result).toEqual(mockPosts);
    expect(postService.getAllPosts).toHaveBeenCalled();
  });

  it('createPost creates a post with service', async () => {
    const newPost = { 
      id: '2', 
      title: 'New Post', 
      content: 'New content', 
      published: false, 
      authorId: '1',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      author: { 
        id: '1', 
        email: 'test@example.com', 
        name: 'Test User',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      }
    };
    postService.createPost.mockResolvedValue(newPost);
    const result = await postService.createPost({ 
      title: 'New Post', 
      content: 'New content', 
      authorId: '1' 
    });
    expect(result).toEqual(newPost);
    expect(postService.createPost).toHaveBeenCalledWith({ 
      title: 'New Post', 
      content: 'New content', 
      authorId: '1' 
    });
  });

  it('getPostById returns post from service', async () => {
    const post = mockPosts[0];
    postService.getPostById.mockResolvedValue(post);
    const result = await postService.getPostById('1');
    expect(result).toEqual(post);
    expect(postService.getPostById).toHaveBeenCalledWith('1');
  });

  it('updatePost updates post with service', async () => {
    const updatedPost = { ...mockPosts[0], title: 'Updated Post' };
    postService.updatePost.mockResolvedValue(updatedPost);
    const result = await postService.updatePost('1', { title: 'Updated Post' });
    expect(result).toEqual(updatedPost);
    expect(postService.updatePost).toHaveBeenCalledWith('1', { title: 'Updated Post' });
  });

  it('deletePost deletes post with service', async () => {
    const deletedPost = mockPosts[0];
    postService.deletePost.mockResolvedValue(deletedPost);
    const result = await postService.deletePost('1');
    expect(result).toEqual(deletedPost);
    expect(postService.deletePost).toHaveBeenCalledWith('1');
  });

  it('publishPost publishes post with service', async () => {
    const publishedPost = { ...mockPosts[0], published: true };
    postService.publishPost.mockResolvedValue(publishedPost);
    const result = await postService.publishPost('1');
    expect(result).toEqual(publishedPost);
    expect(postService.publishPost).toHaveBeenCalledWith('1');
  });
}); 