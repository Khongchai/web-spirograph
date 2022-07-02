package com.khongchai.spiro.repository;

import com.khongchai.spiro.users.Models.User;
import com.khongchai.spiro.users.controllers.UserController;
import com.khongchai.spiro.users.repositories.UserRepository;
import com.khongchai.spiro.users.requests.GetUserRequest;
import com.khongchai.spiro.users.requests.RegisterUserRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static reactor.core.publisher.Mono.when;

@ExtendWith(MockitoExtension.class)
class UserControllerTests {
    @InjectMocks
    UserController userController;

    @Mock
    private UserRepository userRepository;

    private User mockUser;
    private RegisterUserRequest mockRegisterUserRequest;

    @BeforeEach
    void setUp() {
        final String mockId = "mock_id";
        mockUser = new User(mockId, "user@user.com", "user");
        mockRegisterUserRequest = RegisterUserRequest
                .builder()
                .username(mockUser.getUsername())
                .email(mockUser.getEmail())
                .build();
    }

    @Test
    public void testNotCallingSaveIfUserAlreadyExists() {
        given(userRepository.findByEmail(anyString())).willReturn(Mono.just(mockUser));

        StepVerifier.create(userController.loginOrRegister(mockRegisterUserRequest))
            .assertNext(user -> {
                assert(user.equals(mockUser));
                verify(userRepository, times(1)).findByEmail(anyString());
                verify(userRepository, never()).save(mockUser);
            })
            .verifyComplete();
    }

    @Test
    public void testCallingSaveIfUserDoesNotExist(){
        given(userRepository.save(any(User.class))).willReturn(Mono.just(mockUser));
        given(userRepository.findByEmail(anyString())).willReturn(Mono.empty());

        StepVerifier.create(userController.loginOrRegister(mockRegisterUserRequest))
                .assertNext(user -> {
                    assert(user.equals(mockUser));
                    verify(userRepository, times(1)).findByEmail(anyString());
                    verify(userRepository, times(1)).save(mockUser);
                })
                .verifyComplete();
    }

    @Test
    public void testGettingUserWithoutQueryParamsShouldReturnAllUsers(){
        final var mockUsers = new User[]{
                new User("mock_id", "mock_email_1@mock.com", "user1"),
                new User("mock_id2", "mock_email_2@mock.com", "user2")
        };
        given(userRepository.findAll()).willReturn(Flux.just( mockUsers ));

        StepVerifier.create(userController.getUser(null))
                .expectNext(mockUsers)
                .verifyComplete();
    }

    @Test
    public void testGettingUserWithQueryParamsShouldReturnQueriedUser(){
        given(userRepository.findByEmail(anyString())).willReturn(Mono.just(mockUser));
        given(userRepository.findById(anyString())).willReturn(Mono.empty());

        StepVerifier.create(
                userController
                .getUser(
                    GetUserRequest.builder()
                    .email("mockEmail")
                    .id("mockId")
                    .build())
                )
                .assertNext(user -> {
                    verify(userRepository, times(1)).findById("mockEmail");
                    verify(userRepository, times(1)).findByEmail("mockId");
                    verify(userRepository, never()).findAll();
                    assert(user.equals(mockUser));
                })
                .verifyComplete();

    }
}