export interface IUser {
    id: number;
    username: string;
    email: string;
    avatarUrl?: string;
    qrToken: string;
}
export interface IAlbumParticipant {
    id: number;
    username: string;
    avatarUrl: string;
    role: 'owner' | 'editor' | 'viewer';
    status: 'accepted' | 'pending';
}
