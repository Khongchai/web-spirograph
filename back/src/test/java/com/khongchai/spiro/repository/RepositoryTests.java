package com.khongchai.spiro.repository;

import com.khongchai.spiro.users.User;
import com.khongchai.spiro.users.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.util.Assert;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@SpringBootTest
@AutoConfigureWebTestClient
class RepositoryTests {
    private final UserRepository userRepository;

    private final WebTestClient webTestClient;

    @Autowired
    public RepositoryTests(UserRepository userRepository, WebTestClient webTestClient) {
        this.webTestClient = webTestClient;
        this.userRepository = userRepository;
    }

    @AfterEach
    void tearDown() {
        userRepository.deleteAll().block();
    }


    @Test
    public void testUserExistsAfterRegistering() {
        final String mockId = "mock_id";
        var user = new User(mockId, "user@user.com", "user");
        webTestClient.post().uri("user/register").body(Mono.just(user), User.class).exchange().expectStatus()
                .isEqualTo(HttpStatus.CREATED).expectBody().consumeWith(
                        response -> {
                            Mono<User> monoQueriedUser = userRepository.findById(mockId);

                            StepVerifier.create(monoQueriedUser).assertNext(queriedUser -> {
                                Assert.state(queriedUser.getEmail().equals("user@user.com"), "email correct");
                                Assert.state(queriedUser.getUsername().equals("user"), "user name correct");
                            }).expectComplete().verify();
                        }
                );

    }

    @Test
    public void testGettingUserWithoutQueryParamsShouldReturnAllUsers(){
        userRepository.save(new User("mock_id", "mock_email_1@mock.com", "user1"));
        userRepository.save(new User("mock_id2", "mock_email_2@mock.com", "user2"));

        webTestClient.get().uri("user").exchange().expectStatus().isOk().expectBodyList(User.class).hasSize(2);
    }

    @Test
    public void testGettingUserWithQueryParamsShouldReturnQueriedUser(){
        final User newUser = new User("mock_id", "mock_email_1@mock.com", "user1");
        userRepository.save(newUser);

        webTestClient.get().uri("user/?id=mock_id").exchange().expectStatus().isOk().expectBody(User.class).isEqualTo(newUser);
    }
}