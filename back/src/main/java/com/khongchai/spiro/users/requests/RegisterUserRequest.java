package com.khongchai.spiro.users.requests;

import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import lombok.extern.jackson.Jacksonized;

import java.io.Serializable;

@Data
@Builder
@Jacksonized
public class RegisterUserRequest implements Serializable {
    @NonNull
    String email;

    @NonNull
    String username;

    String serializedConfig;
}
