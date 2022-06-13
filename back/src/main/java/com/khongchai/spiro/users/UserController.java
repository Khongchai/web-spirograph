package com.khongchai.spiro.users;

import org.springframework.context.annotation.PropertySource;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
// @PropertySource("classpath:application.properties")
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

    @GetMapping("user")
    Flux<User> all(){
        return userRepository.findAll();
    }

    @GetMapping("user/{id}")
    public  Mono<User> getUser(@PathVariable Long id){
        return userRepository.findById(id);
    }


//    @RequestMapping("${endpoint.user.register}")
    @PostMapping("user")
    Mono<User> register(@RequestBody User newUser){


       return userRepository.save(newUser);
    }
}
