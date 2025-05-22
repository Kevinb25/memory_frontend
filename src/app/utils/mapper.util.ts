import { IUser } from '../interfaces/user.interface';
import { IAlbum } from '../interfaces/album.interface';

export function mapUser(raw: any): IUser {
    return {
        id: raw.id,
        username: raw.username,
        email: raw.email,
        avatarUrl: raw.avatar_url,
        qrToken: raw.qr_token
    };
}

export function mapAlbum(raw: any): IAlbum {
    return {
        id: raw.id,
        name: raw.name,
        category: raw.category,
        theme: raw.theme,
        userId: raw.user_id,
        publicToken: raw.public_token,
        uploadToken: raw.upload_token,
        createdAt: raw.created_at
    };
}