export interface IAlbum {
    id: number;
    name: string;
    theme: string;
    category: string;
    userId: number;
    publicToken: string;
    uploadToken?: string;
    createdAt?: string;
    coverUrl?: string;
}

export interface IAlbumUser extends IAlbum {
    albumId: number;
    role: 'owner' | 'editor' | 'viewer';
    status: 'accepted' | 'pending';
    albumName?: string;
    inviterUsername?: string;
}
