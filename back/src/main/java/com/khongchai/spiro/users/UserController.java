package com.khongchai.spiro.users;

import com.khongchai.spiro.users.models.User;
import com.khongchai.spiro.users.repositories.UserRepository;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.lang.constant.Constable;

@RestController
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //For ping testing
    @GetMapping("/")
    public String pingTest(@RequestParam String someValue){
        return String.format("Request param is %s", someValue);
    }

    @GetMapping("user/users")
    Flux<User> all(){
        return userRepository.findAll();
    }

    @GetMapping("user/{id}")
    public Mono<User> getUser(@PathVariable Long id){
        return userRepository.findById(id);
    }


//    @RequestMapping("${endpoint.user.register}")
    @PostMapping("user/register")
    Mono<User> register(@RequestBody User newUser){
       return userRepository.save(newUser);
    }


}
