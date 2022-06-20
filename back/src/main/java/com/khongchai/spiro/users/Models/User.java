package com.khongchai.spiro.users.Models;

import lombok.*;
import lombok.extern.jackson.Jacksonized;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@AllArgsConstructor
@Value
@Builder
@Jacksonized
public class User {
    @Id
    @Generated
    String id;

    @NonNull
    String email;
    // Allow duplicate username, we login with only email and otp, no password.
    @NonNull
    String username;

    String serializedConfig;
}

