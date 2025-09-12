package project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;

//@CrossOrigin
@EnableScheduling
@SpringBootApplication
@PropertySource("classpath:utils_/utils_.properties")
//@EnableJpaRepositories(repositoryFactoryBeanClass = DataTablesRepositoryFactoryBean.class)
public class Angular003Application {
	public static void main(String[] args) {
		SpringApplication.run(Angular003Application.class, args);
	}
//	@EnableWebMvc 
//	public class WebConfig implements We bMvcConfigurer {
//
//		@Override
//		public void addCorsMappings(CorsRegistry registry) {
//			registry.addMapping("/**").allowedOrigins("*").allowedMethods("*").maxAge(3600L).allowedHeaders("*")
//					.exposedHeaders("Authorization").allowCredentials(true);
//		}
//
//	}

}
