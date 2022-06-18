package com.khongchai.spiro.users;

import com.khongchai.spiro.users.requests.GetUserRequest;
import org.springframework.web.bind.annotation.*;
import reactor.core.CorePublisher;
import reactor.core.publisher.Mono;

import javax.management.InstanceAlreadyExistsException;
import javax.management.InstanceNotFoundException;

@RestController
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
                userRepository.findById(request.getId())
                .switchIfEmpty(userRepository.findByEmail(request.getEmail())).switchIfEmpty(
                        Mono.error(new InstanceNotFoundException("User not found"))
                );
    }


    @PostMapping("${endpoint.user}")
    Mono<User> register(@RequestBody User newUser){

        //check if user already exists
        return userRepository.findByEmail(newUser.getEmail()).switchIfEmpty(Mono.error(
                new InstanceAlreadyExistsException("User already exists"))).flatMap(user -> userRepository.save(newUser));
    }
}
