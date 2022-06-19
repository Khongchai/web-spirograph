package com.khongchai.spiro.users.Models.requests;

import lombok.*;
import lombok.extern.jackson.Jacksonized;

import java.io.Serializable;

@Jacksonized
@Builder
@Value
public class GetUserRequest implements Serializable {
    @NonNull
    String email;

    String id;
}