import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ContactMessage {
    id: bigint;
    name: string;
    email: string;
    message: string;
}
export interface ContactMessageInput {
    name: string;
    email: string;
    message: string;
}
export interface Artwork {
    id: string;
    title: string;
    description: string;
    available: boolean;
    image?: ExternalBlob;
    price: bigint;
}
export interface PurchaseOrder {
    id: bigint;
    itemId: string;
    handled: boolean;
    name: string;
    email: string;
    message?: string;
    itemType: ItemType;
    quantity: bigint;
}
export interface Jewelry {
    id: string;
    name: string;
    type: string;
    weightGram: bigint;
    description: string;
    available: boolean;
    image?: ExternalBlob;
    price: bigint;
    material: string;
}
export interface UserProfile {
    name: string;
}
export enum ItemType {
    jewelry = "jewelry",
    artwork = "artwork"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createArtwork(title: string, description: string, price: bigint): Promise<string>;
    createJewelry(name: string, description: string, price: bigint, material: string, weightGram: bigint, type: string): Promise<string>;
    createOrder(itemId: string, itemType: ItemType, name: string, email: string, message: string | null, quantity: bigint): Promise<bigint>;
    deleteArtwork(id: string): Promise<void>;
    deleteJewelry(id: string): Promise<void>;
    getAboutContent(): Promise<string>;
    getAllArtworks(): Promise<Array<Artwork>>;
    getAllContactMessages(): Promise<Array<ContactMessage>>;
    getAllJewelry(): Promise<Array<Jewelry>>;
    getAllOrders(): Promise<Array<PurchaseOrder>>;
    getArtwork(id: string): Promise<Artwork>;
    getAvailableArtworks(): Promise<Array<Artwork>>;
    getAvailableJewelry(): Promise<Array<Jewelry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getJewelry(id: string): Promise<Jewelry>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markOrderHandled(orderId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendContactMessage(input: ContactMessageInput): Promise<bigint>;
    setArtworkImage(artworkId: string, blob: ExternalBlob): Promise<void>;
    setJewelryImage(jewelryId: string, blob: ExternalBlob): Promise<void>;
    updateArtwork(id: string, title: string, description: string, price: bigint, available: boolean): Promise<void>;
    updateJewelry(id: string, name: string, description: string, price: bigint, available: boolean, material: string, weightGram: bigint, type: string): Promise<void>;
}
