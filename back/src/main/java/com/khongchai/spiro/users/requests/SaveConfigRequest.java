package com.khongchai.spiro.users.requests;

import lombok.AllArgsConstructor;
import lombok.NonNull;

import java.io.Serializable;

@AllArgsConstructor
public class SaveConfigRequest implements Serializable {

    @NonNull
    String serializedConfig;
}
