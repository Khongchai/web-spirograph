package com.khongchai.spiro.users;

import com.khongchai.spiro.users.Models.User;
import com.khongchai.spiro.users.Models.requests.GetUserRequest;
import lombok.NonNull;
import org.springframework.web.bind.annotation.*;
import reactor.core.CorePublisher;
import reactor.core.publisher.Mono;

import javax.management.InstanceNotFoundException;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //For ping testing
    @GetMapping("${endpoint.pingtest}")
    public String pingTest(@RequestParam String someValue){
        return String.format("Request param is %s", someValue);
    }

    @GetMapping("${endpoint.user}")
    public CorePublisher<User> getUser(GetUserRequest request){
        return request == null ?
                userRepository.findAll() :
                userRepository.findById(request.getId()).switchIfEmpty(
                        userRepository.findByEmail(request.getEmail())).switchIfEmpty(
                        Mono.defer(() -> Mono.error(new InstanceNotFoundException("Not found for using with email and id = " +
                                request.getEmail() + " " + request.getId())))
                        );
    }

    @PostMapping("${endpoint.user}")
    public Mono<User> register(@NonNull  @RequestBody User newUser){
        return userRepository.findByEmail(newUser.getEmail()).switchIfEmpty(
                Mono.defer(() -> userRepository.save(newUser))
        );
    }

}
