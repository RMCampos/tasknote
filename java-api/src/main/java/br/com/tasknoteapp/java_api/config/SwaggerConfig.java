package br.com.tasknoteapp.java_api.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityScheme.Type;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** This class contains the configuration for Swagger API. */
@Configuration
public class SwaggerConfig {

  @Value("${br.com.tasknote.java-api.version}")
  private String nrSparBackendVersion;

  /**
   * Gets the API OpenAPI config.
   *
   * @return OpenAPI with config.
   */
  @Bean
  public OpenAPI apiConfig() {
    Info info = new Info();
    info.setTitle("TaskNote API");
    info.setDescription("RESTful service API to serve the TaskNote client Web App.");
    info.setVersion(nrSparBackendVersion);

    Contact contact = new Contact();
    contact.setName("Ricardo Campos");
    contact.setEmail("ricardompcampos@gmail.com");
    contact.setUrl("https://github.com/ricardo-campos-org/react-typescript-todolist");
    info.setContact(contact);

    License license = new License();
    license.setName("GPL 3.0");
    license.setUrl("https://www.gnu.org/licenses/gpl-3.0");
    info.setLicense(license);

    SecurityScheme securityScheme = new SecurityScheme();
    securityScheme.setType(Type.HTTP);
    securityScheme.setScheme("bearer");
    securityScheme.setBearerFormat("JWT");

    Components components = new Components();
    components.addSecuritySchemes("bearerAuth", securityScheme);

    OpenAPI openApi = new OpenAPI();
    openApi.setInfo(info);
    openApi.addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    openApi.setComponents(components);

    return openApi;
  }
}
