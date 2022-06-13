package com.khongchai.spiro.users;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
@AllArgsConstructor
public class User {
    @Id
    Long id;

    String email;
    String username;
    String password;
}

