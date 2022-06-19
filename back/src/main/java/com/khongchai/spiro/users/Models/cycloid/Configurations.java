package com.khongchai.spiro.users.Models.cycloid;

import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

@Builder
@Data
@Jacksonized
public class Configurations {
    private final OuterMostBoundingCircle outermostBoundingCircle;
}
