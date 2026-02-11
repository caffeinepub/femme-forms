import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Artwork, Jewelry, PurchaseOrder, ContactMessage, ContactMessageInput, UserProfile, ItemType } from '../backend';
import { ExternalBlob } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Queries
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Artwork Queries
export function useGetAllArtworks() {
  const { actor, isFetching } = useActor();

  return useQuery<Artwork[]>({
    queryKey: ['artworks', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArtworks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAvailableArtworks() {
  const { actor, isFetching } = useActor();

  return useQuery<Artwork[]>({
    queryKey: ['artworks', 'available'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableArtworks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArtwork(id: string, options?: { enabled?: boolean }) {
  const { actor, isFetching } = useActor();

  return useQuery<Artwork>({
    queryKey: ['artwork', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getArtwork(id);
    },
    enabled: !!actor && !isFetching && !!id && (options?.enabled !== false),
  });
}

export function useCreateArtwork() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; description: string; price: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createArtwork(data.title, data.description, data.price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
    },
  });
}

export function useUpdateArtwork() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
      description: string;
      price: bigint;
      available: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateArtwork(data.id, data.title, data.description, data.price, data.available);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      queryClient.invalidateQueries({ queryKey: ['artwork', variables.id] });
    },
  });
}

export function useDeleteArtwork() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteArtwork(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
    },
  });
}

export function useSetArtworkImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { artworkId: string; blob: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setArtworkImage(data.artworkId, data.blob);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      queryClient.invalidateQueries({ queryKey: ['artwork', variables.artworkId] });
    },
  });
}

// Jewelry Queries
export function useGetAllJewelry() {
  const { actor, isFetching } = useActor();

  return useQuery<Jewelry[]>({
    queryKey: ['jewelry', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJewelry();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAvailableJewelry() {
  const { actor, isFetching } = useActor();

  return useQuery<Jewelry[]>({
    queryKey: ['jewelry', 'available'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableJewelry();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetJewelry(id: string, options?: { enabled?: boolean }) {
  const { actor, isFetching } = useActor();

  return useQuery<Jewelry>({
    queryKey: ['jewelry', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getJewelry(id);
    },
    enabled: !!actor && !isFetching && !!id && (options?.enabled !== false),
  });
}

export function useCreateJewelry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      price: bigint;
      material: string;
      weightGram: bigint;
      type: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createJewelry(
        data.name,
        data.description,
        data.price,
        data.material,
        data.weightGram,
        data.type
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jewelry'] });
    },
  });
}

export function useUpdateJewelry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      description: string;
      price: bigint;
      available: boolean;
      material: string;
      weightGram: bigint;
      type: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateJewelry(
        data.id,
        data.name,
        data.description,
        data.price,
        data.available,
        data.material,
        data.weightGram,
        data.type
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jewelry'] });
      queryClient.invalidateQueries({ queryKey: ['jewelry', variables.id] });
    },
  });
}

export function useDeleteJewelry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteJewelry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jewelry'] });
    },
  });
}

export function useSetJewelryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { jewelryId: string; blob: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setJewelryImage(data.jewelryId, data.blob);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jewelry'] });
      queryClient.invalidateQueries({ queryKey: ['jewelry', variables.jewelryId] });
    },
  });
}

// Order Queries
export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<PurchaseOrder[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      itemId: string;
      itemType: ItemType;
      name: string;
      email: string;
      message: string | null;
      quantity: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(
        data.itemId,
        data.itemType,
        data.name,
        data.email,
        data.message,
        data.quantity
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useMarkOrderHandled() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markOrderHandled(orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// Contact Message Queries
export function useGetAllContactMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactMessage[]>({
    queryKey: ['contactMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContactMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendContactMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ContactMessageInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendContactMessage(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
    },
  });
}

// About Content Query
export function useGetAboutContent() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['aboutContent'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getAboutContent();
    },
    enabled: !!actor && !isFetching,
  });
}
