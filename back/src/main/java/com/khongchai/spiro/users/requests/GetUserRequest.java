package com.khongchai.spiro.users.requests;

import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

import java.io.Serializable;

@Jacksonized
@Builder
@Data
public class GetUserRequest implements Serializable {
    String email;
    String id;
}