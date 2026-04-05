## ============================================
## Build Stage - Using same Maven as local
## ============================================
#FROM maven:3.9-eclipse-temurin-17 AS build
#
#WORKDIR /app
#
## Copy Maven wrapper (if you have it)
#COPY mvnw* .
#COPY .mvn .mvn
#
## Copy pom.xml
#COPY pom.xml .
#
## Download dependencies
#RUN mvn dependency:resolve dependency:resolve-plugins
#
## Copy source code
#COPY src ./src
#
## Build the application
#RUN mvn clean package -DskipTests
#
## ============================================
## Runtime Stage
## ============================================
#FROM eclipse-temurin:17-jre-alpine
#
#WORKDIR /app
#
## Copy JAR from build stage
#COPY --from=build /app/target/*.jar app.jar
#
#EXPOSE 8080
#
#ENTRYPOINT ["java", "-jar", "app.jar"]

# ============================================
# Build Stage - USING JAVA 21
# ============================================
FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Copy pom.xml
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests -B

# ============================================
# Runtime Stage - USING JAVA 21
# ============================================
FROM eclipse-temurin:21-jre-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copy JAR file
COPY --from=build /app/target/Ecommerce_Project-0.0.1-SNAPSHOT.jar app.jar

# Create non-root user
RUN addgroup -g 1001 spring && \
    adduser -D -u 1001 -G spring spring && \
    chown -R spring:spring /app

USER spring:spring

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# JVM options
ENV JAVA_OPTS="-Xms256m -Xmx512m"

ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar app.jar"]