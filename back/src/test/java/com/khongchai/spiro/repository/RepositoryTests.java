package com.khongchai.spiro.repository;

import com.khongchai.spiro.users.models.User;
import com.khongchai.spiro.users.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.util.Assert;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@SpringBootTest
class RepositoryTests {
    private final UserRepository userRepository;

    private final WebTestClient webTestClient;

    @Autowired
    public RepositoryTests(UserRepository userRepository, WebTestClient webTestClient) {
        this.webTestClient = webTestClient;
        this.userRepository = userRepository;
    }

    @Test
    public void testUserExistsAfterRegistering() {
        var user = new User(1L, "user@user.com", "user", "password");
        webTestClient.post().uri("user/register").body(Mono.just(user), User.class).exchange().expectStatus().isEqualTo(HttpStatus.CREATED);

        Mono<User> monoQueriedUser = userRepository.findById(1L);

        StepVerifier.create(monoQueriedUser).assertNext(queriedUser -> {
            Assert.state(queriedUser.getEmail().equals("user@user.com"), "email correct");
            Assert.state(queriedUser.getUsername().equals("user"), "user name correct");
        }).expectComplete().verify();
    }
}