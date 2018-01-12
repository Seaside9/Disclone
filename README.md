# Disclone

Disclone is a full-stack live-chat, web application inspired by Discord. Disclone uses the React-Redux architectual framework on the frontend, and the Ruby on Rails paired with a PostgresSQL database on the backend.

## Features & Implementation

### Online Status

When a user subscribes to an ActionCable Channel, that user's online status is updated to online. In addition, that information is then broadcasted to all relevant users (The user's friends, any other users that have direct messages with the user, and those that share a server with the user), and the online status is updated accordingly on the frontend. Consequently, when a user unsubscrbes to an ActionCable Channel, the opposite happens.

### Friendships

A friendship is implemented through a `Friendship` model, which `belongs_to` a `User`. When a particular user chooses to create a friendship, two Friendship models are created:

* Friendship: {friend_1_id: current_user.id, friend_2_id: target_user.id}
* Friendship: {friend_1_id: target_user.id, friend_2_id: current_user.id}

### Direct Messages

### Servers/Channels

### Livechat

#### Backend

Messages are stored in the databse with a one-to-one association with a `User` (author), as well as polymorphic association with a `Channel` or `Dm` (Direct Messages) as `messageable`. When a message is sent, the Message controller finds relevant memberships (`ChannelMembership` or `DmMembership`) and updates an unread counter accordingly.



