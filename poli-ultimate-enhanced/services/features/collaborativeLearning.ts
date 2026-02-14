// Collaborative Learning System - Share notes, discuss, and learn together

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  topic: string;
  members: GroupMember[];
  createdBy: string;
  createdAt: string;
  privacy: 'public' | 'private' | 'invite-only';
  activities: GroupActivity[];
  resources: SharedResource[];
  goals: string[];
}

export interface GroupMember {
  userId: string;
  username: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  contributions: number;
  level: number;
}

export interface GroupActivity {
  id: string;
  type: 'discussion' | 'quiz' | 'resource' | 'achievement';
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  reactions: Reaction[];
}

export interface Reaction {
  userId: string;
  emoji: string;
  timestamp: string;
}

export interface SharedResource {
  id: string;
  title: string;
  type: 'note' | 'bookmark' | 'summary' | 'quiz';
  content: any;
  sharedBy: string;
  sharedAt: string;
  votes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  replies: Comment[];
}

export interface Discussion {
  id: string;
  groupId: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  tags: string[];
  replies: DiscussionReply[];
  views: number;
  solved: boolean;
}

export interface DiscussionReply {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  upvotes: number;
  isAnswer: boolean;
}

class CollaborativeLearningSystem {
  private studyGroups: Map<string, StudyGroup> = new Map();
  private discussions: Map<string, Discussion> = new Map();
  private GROUPS_KEY = 'poli_study_groups';
  private DISCUSSIONS_KEY = 'poli_discussions';
  private currentUserId: string;
  private currentUsername: string;

  constructor() {
    this.currentUserId = this.getUserId();
    this.currentUsername = this.getUsername();
    this.loadGroups();
    this.loadDiscussions();
  }

  private getUserId(): string {
    let userId = localStorage.getItem('poli_collab_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('poli_collab_user_id', userId);
    }
    return userId;
  }

  private getUsername(): string {
    try {
      const authUser = localStorage.getItem('poli_auth_user');
      if (authUser) {
        const user = JSON.parse(authUser);
        return user.displayName || 'Anonymous Scholar';
      }
    } catch {}
    return 'Anonymous Scholar';
  }

  private loadGroups(): void {
    try {
      const stored = localStorage.getItem(this.GROUPS_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.studyGroups = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load study groups:', error);
    }
  }

  private saveGroups(): void {
    try {
      const data = Object.fromEntries(this.studyGroups);
      localStorage.setItem(this.GROUPS_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save study groups:', error);
    }
  }

  private loadDiscussions(): void {
    try {
      const stored = localStorage.getItem(this.DISCUSSIONS_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.discussions = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load discussions:', error);
    }
  }

  private saveDiscussions(): void {
    try {
      const data = Object.fromEntries(this.discussions);
      localStorage.setItem(this.DISCUSSIONS_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save discussions:', error);
    }
  }

  createStudyGroup(
    name: string,
    description: string,
    topic: string,
    privacy: StudyGroup['privacy'] = 'public'
  ): StudyGroup {
    const group: StudyGroup = {
      id: 'group_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name,
      description,
      topic,
      members: [{
        userId: this.currentUserId,
        username: this.currentUsername,
        role: 'admin',
        joinedAt: new Date().toISOString(),
        contributions: 0,
        level: 1
      }],
      createdBy: this.currentUserId,
      createdAt: new Date().toISOString(),
      privacy,
      activities: [],
      resources: [],
      goals: []
    };

    this.studyGroups.set(group.id, group);
    this.saveGroups();
    return group;
  }

  joinGroup(groupId: string): boolean {
    const group = this.studyGroups.get(groupId);
    if (!group) return false;

    // Check if already a member
    if (group.members.some(m => m.userId === this.currentUserId)) {
      return false;
    }

    group.members.push({
      userId: this.currentUserId,
      username: this.currentUsername,
      role: 'member',
      joinedAt: new Date().toISOString(),
      contributions: 0,
      level: 1
    });

    this.addActivity(groupId, 'achievement', `${this.currentUsername} joined the group`);
    this.saveGroups();
    return true;
  }

  leaveGroup(groupId: string): boolean {
    const group = this.studyGroups.get(groupId);
    if (!group) return false;

    group.members = group.members.filter(m => m.userId !== this.currentUserId);
    
    if (group.members.length === 0) {
      this.studyGroups.delete(groupId);
    }

    this.saveGroups();
    return true;
  }

  shareResource(
    groupId: string,
    resource: Omit<SharedResource, 'id' | 'sharedBy' | 'sharedAt' | 'votes' | 'comments'>
  ): SharedResource | null {
    const group = this.studyGroups.get(groupId);
    if (!group) return null;

    const sharedResource: SharedResource = {
      ...resource,
      id: 'res_' + Date.now(),
      sharedBy: this.currentUsername,
      sharedAt: new Date().toISOString(),
      votes: 0,
      comments: []
    };

    group.resources.push(sharedResource);
    this.addActivity(groupId, 'resource', `${this.currentUsername} shared ${resource.title}`);
    
    // Increment contribution count
    const member = group.members.find(m => m.userId === this.currentUserId);
    if (member) member.contributions++;

    this.saveGroups();
    return sharedResource;
  }

  private addActivity(
    groupId: string,
    type: GroupActivity['type'],
    content: string
  ): void {
    const group = this.studyGroups.get(groupId);
    if (!group) return;

    group.activities.push({
      id: 'activity_' + Date.now(),
      type,
      userId: this.currentUserId,
      username: this.currentUsername,
      content,
      timestamp: new Date().toISOString(),
      reactions: []
    });

    // Keep only last 50 activities
    if (group.activities.length > 50) {
      group.activities = group.activities.slice(-50);
    }
  }

  createDiscussion(
    groupId: string,
    title: string,
    content: string,
    tags: string[] = []
  ): Discussion | null {
    const group = this.studyGroups.get(groupId);
    if (!group) return null;

    const discussion: Discussion = {
      id: 'disc_' + Date.now(),
      groupId,
      title,
      content,
      author: this.currentUsername,
      createdAt: new Date().toISOString(),
      tags,
      replies: [],
      views: 0,
      solved: false
    };

    this.discussions.set(discussion.id, discussion);
    this.addActivity(groupId, 'discussion', `${this.currentUsername} started: ${title}`);
    this.saveDiscussions();
    return discussion;
  }

  replyToDiscussion(
    discussionId: string,
    content: string,
    isAnswer: boolean = false
  ): boolean {
    const discussion = this.discussions.get(discussionId);
    if (!discussion) return false;

    discussion.replies.push({
      id: 'reply_' + Date.now(),
      author: this.currentUsername,
      content,
      timestamp: new Date().toISOString(),
      upvotes: 0,
      isAnswer
    });

    if (isAnswer) {
      discussion.solved = true;
    }

    this.saveDiscussions();
    return true;
  }

  voteResource(groupId: string, resourceId: string, vote: 1 | -1): boolean {
    const group = this.studyGroups.get(groupId);
    if (!group) return false;

    const resource = group.resources.find(r => r.id === resourceId);
    if (!resource) return false;

    resource.votes += vote;
    this.saveGroups();
    return true;
  }

  addReaction(groupId: string, activityId: string, emoji: string): boolean {
    const group = this.studyGroups.get(groupId);
    if (!group) return false;

    const activity = group.activities.find(a => a.id === activityId);
    if (!activity) return false;

    // Remove existing reaction from this user
    activity.reactions = activity.reactions.filter(r => r.userId !== this.currentUserId);

    // Add new reaction
    activity.reactions.push({
      userId: this.currentUserId,
      emoji,
      timestamp: new Date().toISOString()
    });

    this.saveGroups();
    return true;
  }

  getMyGroups(): StudyGroup[] {
    return Array.from(this.studyGroups.values())
      .filter(g => g.members.some(m => m.userId === this.currentUserId));
  }

  getPublicGroups(): StudyGroup[] {
    return Array.from(this.studyGroups.values())
      .filter(g => g.privacy === 'public');
  }

  getGroupDiscussions(groupId: string): Discussion[] {
    return Array.from(this.discussions.values())
      .filter(d => d.groupId === groupId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  searchGroups(query: string): StudyGroup[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.studyGroups.values()).filter(g =>
      g.name.toLowerCase().includes(lowerQuery) ||
      g.topic.toLowerCase().includes(lowerQuery) ||
      g.description.toLowerCase().includes(lowerQuery)
    );
  }

  getGroupStatistics(groupId: string): {
    memberCount: number;
    resourceCount: number;
    activityCount: number;
    discussionCount: number;
    totalContributions: number;
  } | null {
    const group = this.studyGroups.get(groupId);
    if (!group) return null;

    return {
      memberCount: group.members.length,
      resourceCount: group.resources.length,
      activityCount: group.activities.length,
      discussionCount: this.getGroupDiscussions(groupId).length,
      totalContributions: group.members.reduce((sum, m) => sum + m.contributions, 0)
    };
  }

  exportGroupData(groupId: string): string | null {
    const group = this.studyGroups.get(groupId);
    if (!group) return null;

    const discussions = this.getGroupDiscussions(groupId);

    return JSON.stringify({
      group,
      discussions
    }, null, 2);
  }
}

export const collaborativeLearningSystem = new CollaborativeLearningSystem();
