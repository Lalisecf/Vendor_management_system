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
        // for production server

        // contextSource.setUrl("ldap://10.10.12.2:389");
        // contextSource.setBase("dc=awash,dc=local");
        // contextSource.setUserDn("demekeaya@awash.local");
        // contextSource.setPassword("Final@2233");

        // for test server
        contextSource.setUrl("ldap://awashtest.local");
        contextSource.setBase("dc=awashtest,dc=local");
        // contextSource.setUserDn("demekea@awashtest.local");
        // contextSource.setPassword("dem@aib22");
        contextSource.afterPropertiesSet(); // required
        return new LdapTemplate(contextSource);
    }
}
