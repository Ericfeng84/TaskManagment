package com.taskmanager.dto;

import java.util.UUID;

public class UserDTO {
    private UUID id;
    private String email;
    private String name;
    private String avatar;

    public UserDTO() {
    }

    public UserDTO(UUID id, String email, String name, String avatar) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.avatar = avatar;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
}