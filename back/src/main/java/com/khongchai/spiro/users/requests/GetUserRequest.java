package com.khongchai.spiro.users.requests;

import lombok.Builder;
import lombok.NonNull;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

import java.io.Serializable;

@Jacksonized
@Builder
@Value
public class GetUserRequest implements Serializable {
    @NonNull
    String email;

    String id;

    String serializedConfig;
}