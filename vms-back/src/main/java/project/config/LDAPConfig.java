package project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;

@Configuration
public class LDAPConfig {
    @Bean
    public LdapTemplate ldapTemplate() {
        LdapContextSource contextSource = new LdapContextSource();


        // for test server
        contextSource.setUrl("ld");
        contextSource.setBase("d");
        contextSource.afterPropertiesSet(); // required
        return new LdapTemplate(contextSource);
    }
}
