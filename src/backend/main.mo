import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";



actor {
  var artworkIdCounter = 0;
  let artworks = Map.empty<Text, Artwork>();
  var jewelryIdCounter = 0;
  let jewelryItems = Map.empty<Text, Jewelry>();
  var orderIdCounter = 0;
  let orders = Map.empty<Nat, PurchaseOrder>();
  let contactMessages = Map.empty<Nat, ContactMessage>();
  var messageIdCounter = 0;
  let userProfiles = Map.empty<Principal, UserProfile>();

  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type Artwork = {
    id : Text;
    title : Text;
    description : Text;
    image : ?Storage.ExternalBlob;
    price : Nat;
    available : Bool;
  };

  public type Jewelry = {
    id : Text;
    name : Text;
    description : Text;
    image : ?Storage.ExternalBlob;
    price : Nat;
    available : Bool;
    material : Text;
    weightGram : Nat;
    type_ : Text;
  };

  public type PurchaseOrder = {
    id : Nat;
    itemId : Text;
    itemType : ItemType;
    name : Text;
    email : Text;
    message : ?Text;
    quantity : Nat;
    handled : Bool;
  };

  public type ContactMessage = {
    id : Nat;
    name : Text;
    email : Text;
    message : Text;
  };

  public type ItemType = {
    #artwork;
    #jewelry;
  };

  module ArtworkOrder {
    func toComparableText(text : Text) : Text {
      text.toLower();
    };

    public func compare(artwork1 : Artwork, artwork2 : Artwork) : Order.Order {
      Text.compare(artwork1.title, artwork2.title);
    };

    public func compareById(artwork1 : Artwork, artwork2 : Artwork) : Order.Order {
      Text.compare(artwork1.id, artwork2.id);
    };
  };

  module JewelryOrder {
    func toComparableText(text : Text) : Text {
      text.toLower();
    };

    public func compare(jewelry1 : Jewelry, jewelry2 : Jewelry) : Order.Order {
      Text.compare(jewelry1.name, jewelry2.name);
    };

    public func compareById(jewelry1 : Jewelry, jewelry2 : Jewelry) : Order.Order {
      Text.compare(jewelry1.id, jewelry2.id);
    };
  };

  module PurchaseOrder {
    public func compare(order1 : PurchaseOrder, order2 : PurchaseOrder) : Order.Order {
      Nat.compare(order1.id, order2.id);
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Artwork Management (Admin-only)
  public shared ({ caller }) func createArtwork(title : Text, description : Text, price : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create artworks");
    };
    if (title.size() == 0 or title.size() > 100) {
      Runtime.trap("Title must be between 1 and 100 characters");
    };

    artworkIdCounter += 1;
    let id = artworkIdCounter.toText();
    let artwork : Artwork = {
      id;
      title;
      description;
      image = null;
      price;
      available = true;
    };
    artworks.add(id, artwork);
    id;
  };

  public shared ({ caller }) func updateArtwork(id : Text, title : Text, description : Text, price : Nat, available : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update artworks");
    };
    let artwork = switch (artworks.get(id)) {
      case (null) { Runtime.trap("Artwork not found") };
      case (?artwork) { artwork };
    };
    let updatedArtwork : Artwork = {
      id;
      title;
      description;
      image = artwork.image;
      price;
      available;
    };
    artworks.add(id, updatedArtwork);
  };

  public shared ({ caller }) func deleteArtwork(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete artworks");
    };
    switch (artworks.get(id)) {
      case (null) { Runtime.trap("Artwork not found") };
      case (_) {};
    };
    artworks.remove(id);
  };

  public shared ({ caller }) func setArtworkImage(artworkId : Text, blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set artwork images");
    };
    let artwork = switch (artworks.get(artworkId)) {
      case (null) { Runtime.trap("Artwork not found") };
      case (?artwork) { artwork };
    };
    artworks.add(artworkId, { artwork with image = ?blob });
  };

  // Artwork Queries
  public query ({ caller }) func getAllArtworks() : async [Artwork] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all artworks");
    };
    artworks.values().toArray().sort();
  };

  public query ({ caller }) func getArtwork(id : Text) : async Artwork {
    // Public access for storefront detail views
    switch (artworks.get(id)) {
      case (null) { Runtime.trap("Artwork not found") };
      case (?artwork) { artwork };
    };
  };

  public query ({ caller }) func getAvailableArtworks() : async [Artwork] {
    // Public access for storefront browsing
    artworks.values().toArray().filter(
      func(artwork) { artwork.available }
    ).sort();
  };

  // Jewelry Management (Admin-only)
  public shared ({ caller }) func createJewelry(
    name : Text,
    description : Text,
    price : Nat,
    material : Text,
    weightGram : Nat,
    type_ : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create jewelry items");
    };

    jewelryIdCounter += 1;
    let id = jewelryIdCounter.toText();
    let jewelry : Jewelry = {
      id;
      name;
      description;
      image = null;
      price;
      available = true;
      material;
      weightGram;
      type_;
    };
    jewelryItems.add(id, jewelry);
    id;
  };

  public shared ({ caller }) func updateJewelry(
    id : Text,
    name : Text,
    description : Text,
    price : Nat,
    available : Bool,
    material : Text,
    weightGram : Nat,
    type_ : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update jewelry items");
    };
    let jewelry = switch (jewelryItems.get(id)) {
      case (null) { Runtime.trap("Jewelry item not found") };
      case (?jewelry) { jewelry };
    };
    let updatedJewelry : Jewelry = {
      id;
      name;
      description;
      image = jewelry.image;
      price;
      available;
      material;
      weightGram;
      type_;
    };
    jewelryItems.add(id, updatedJewelry);
  };

  public shared ({ caller }) func deleteJewelry(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete jewelry items");
    };
    switch (jewelryItems.get(id)) {
      case (null) { Runtime.trap("Jewelry item not found") };
      case (_) {};
    };
    jewelryItems.remove(id);
  };

  public shared ({ caller }) func setJewelryImage(jewelryId : Text, blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set jewelry images");
    };
    let jewelry = switch (jewelryItems.get(jewelryId)) {
      case (null) { Runtime.trap("Jewelry item not found") };
      case (?jewelry) { jewelry };
    };
    jewelryItems.add(jewelryId, { jewelry with image = ?blob });
  };

  // Jewelry Queries
  public query ({ caller }) func getAllJewelry() : async [Jewelry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all jewelry items");
    };
    jewelryItems.values().toArray().sort();
  };

  public query ({ caller }) func getJewelry(id : Text) : async Jewelry {
    // Public access for storefront detail views
    switch (jewelryItems.get(id)) {
      case (null) { Runtime.trap("Jewelry item not found") };
      case (?jewelry) { jewelry };
    };
  };

  public query ({ caller }) func getAvailableJewelry() : async [Jewelry] {
    // Public access for storefront browsing
    jewelryItems.values().toArray().filter(
      func(jewelry) { jewelry.available }
    ).sort();
  };

  // Order Management
  public shared ({ caller }) func createOrder(
    itemId : Text,
    itemType : ItemType,
    name : Text,
    email : Text,
    message : ?Text,
    quantity : Nat,
  ) : async Nat {
    // Public access - anyone can place an order
    if (name.size() == 0 or email.size() == 0) {
      Runtime.trap("Name and email are required");
    };
    switch (itemType) {
      case (#artwork) {
        let artwork = switch (artworks.get(itemId)) {
          case (null) { Runtime.trap("Artwork not found") };
          case (?artwork) { artwork };
        };
        if (not artwork.available) {
          Runtime.trap("Artwork is no longer available");
        };
      };
      case (#jewelry) {
        let jewelry = switch (jewelryItems.get(itemId)) {
          case (null) { Runtime.trap("Jewelry item not found") };
          case (?jewelry) { jewelry };
        };
        if (not jewelry.available) {
          Runtime.trap("Jewelry item is no longer available");
        };
      };
    };

    orderIdCounter += 1;
    let order : PurchaseOrder = {
      id = orderIdCounter;
      itemId;
      itemType;
      name;
      email;
      message;
      quantity;
      handled = false;
    };
    orders.add(orderIdCounter, order);
    orderIdCounter;
  };

  public query ({ caller }) func getAllOrders() : async [PurchaseOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    orders.values().toArray().sort();
  };

  public shared ({ caller }) func markOrderHandled(orderId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update orders");
    };
    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
    orders.add(orderId, { order with handled = true });
  };

  // Contact Messages
  type ContactMessageInput = {
    name : Text;
    email : Text;
    message : Text;
  };

  public shared ({ caller }) func sendContactMessage(input : ContactMessageInput) : async Nat {
    // Public access - anyone can send a contact message
    if (input.name.size() == 0 or input.email.size() == 0 or input.message.size() == 0) {
      Runtime.trap("All fields are required");
    };

    messageIdCounter += 1;
    let message : ContactMessage = {
      id = messageIdCounter;
      name = input.name;
      email = input.email;
      message = input.message;
    };
    contactMessages.add(messageIdCounter, message);
    messageIdCounter;
  };

  public query ({ caller }) func getAllContactMessages() : async [ContactMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact messages");
    };
    contactMessages.values().toArray();
  };

  // About Content
  public query ({ caller }) func getAboutContent() : async Text {
    // Public access - anyone can view about content
    "Welcome to the Art Shop! This is a placeholder for the artist's biography and information.";
  };
};
