package com.khongchai.spiro.repository;

import com.khongchai.spiro.users.User;
import com.khongchai.spiro.users.UserController;
import com.khongchai.spiro.users.UserRepository;
import com.khongchai.spiro.users.requests.GetUserRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.util.Assert;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.ArgumentMatchers.anyString;
import static reactor.core.publisher.Mono.when;

@SpringBootTest
@AutoConfigureWebTestClient
@ExtendWith(MockitoExtension.class)
class UserControllerTests {
    @InjectMocks
    UserController userController;

    @Mock
    private UserRepository userRepository;


    @Test
    public void testUserExistsAfterRegistering() {
        final String mockId = "mock_id";
        var mockUser = new User(mockId, "user@user.com", "user");

        //TODO nullpointerexception for some reasons.
        when(userRepository.findById(anyString())).thenReturn(Mono.just(mockUser));

        StepVerifier.create(userController.register(mockUser))
            .assertNext(user -> {
                assert(user == mockUser);
            })
            .verifyComplete();
    }

    @Test
    public void testGettingUserWithoutQueryParamsShouldReturnAllUsers(){
        when(userRepository.findAll()).thenReturn(Flux.just(
                new User("mock_id", "mock_email_1@mock.com", "user1"),
                new User("mock_id2", "mock_email_2@mock.com", "user2")));
//        webTestClient.get().uri("user").exchange().expectStatus().isOk().expectBodyList(User.class).hasSize(2);
    }

    @Test
    public void testGettingUserWithQueryParamsShouldReturnQueriedUser(){
        final var mockEmail = "mock_email_1@mock.com";
        final var newUser = new User("mock_id", mockEmail, "user1");

        when(userRepository.findByEmail(mockEmail)).thenReturn(Mono.just(newUser));


//        webTestClient.get().uri("user?email=" + mockEmail).exchange().expectStatus().isOk().expectBody(User.class).isEqualTo(newUser);
    }
}