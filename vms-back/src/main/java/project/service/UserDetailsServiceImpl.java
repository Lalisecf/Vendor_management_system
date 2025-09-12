package project.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import project.mapper.MapperAuth;
import project.model.Roles;
import project.model.User;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private MapperAuth mapper;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		System.out.println("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiyuyyyyyyyyyyyyyyyyy: " + email);
		User user = mapper.findByUserName(email)
				.orElseThrow(() -> new UsernameNotFoundException("No user found " + email));
		return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), true,
				true, true, true, getAuthorities(user.getRoles()));
	}

	private Collection<? extends GrantedAuthority> getAuthorities(Collection<Roles> roles) {
		List<GrantedAuthority> authList = new ArrayList<GrantedAuthority>(1);

		for (Roles role : roles) {

			authList.add(new GrantedAuthority() {
				@Override
				public String getAuthority() {
					// TODO Auto-generated method stub
					return role.getName();
				}
			});
		}
		return authList;
	}

}
