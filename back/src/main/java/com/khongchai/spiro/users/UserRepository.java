package com.khongchai.spiro.users;

import com.khongchai.spiro.users.Models.User;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface UserRepository extends ReactiveMongoRepository<User, String> {
    @Query("{'email': ?0}")
    Mono<User> findByEmail(String email);

}
