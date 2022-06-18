package com.khongchai.spiro.users;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Generated;
import lombok.NonNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@AllArgsConstructor
@Data
public class User {
    @Id
    @Generated
    String id;

    @NonNull
    String email;
    // Allow duplicate username, we login with only email and otp, no password.
    @NonNull
    String username;
}

