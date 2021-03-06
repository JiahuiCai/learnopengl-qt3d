#version 330 core

struct Material {
	sampler2D diffuse;
	sampler2D specular;
	sampler2D emission;
	float shininess;
};

struct Light {
	vec3 position;

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
};

varying vec3 normal;
varying vec3 fragPos;
varying vec2 texCoord;

out vec4 color;

uniform float time;
uniform vec3 viewPos;
uniform Material material;
uniform Light light;

void main()
{
	// Ambient
	vec3 ambient = light.ambient * vec3(texture(material.diffuse, texCoord));

	// Diffuse
	vec3 norm = normalize(normal);
	vec3 lightDir = normalize(light.position - fragPos);
	float diff = max(dot(norm, lightDir), 0.0f);
	vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, texCoord));

	// Specular
	vec3 viewDir = normalize(viewPos - fragPos);
	vec3 reflectDir = reflect(-lightDir, norm);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0f), material.shininess);
	vec3 specColor = vec3(texture(material.specular, texCoord));
	vec3 specular = light.specular * spec * specColor;

	// Emission
	vec3 emission = length(specColor) < 1e-2f ?
		vec3(texture(material.emission, texCoord + vec2(0.0f, time))) : vec3(0.0f);

	vec3 result = ambient + diffuse + specular + emission;
	gl_FragColor = vec4(result, 1.0f);
}
