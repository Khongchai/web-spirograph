package com.khongchai.spiro.users.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NonNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
@AllArgsConstructor
public class User {
    @Id
    Long id;

    @NonNull
    String email;
    @NonNull
    String username;
    @NonNull
    String password;

}

