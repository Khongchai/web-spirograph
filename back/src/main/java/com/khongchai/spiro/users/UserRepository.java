package com.khongchai.spiro.users;

import com.khongchai.spiro.users.User;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends ReactiveMongoRepository<User, Long> {
}
