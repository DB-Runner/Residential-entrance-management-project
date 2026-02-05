package com.smartentrance.backend.payment;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConditionalOnProperty(name = "payment.stripe.enabled", havingValue = "true")
@ConfigurationProperties(prefix = "stripe")
public record StripeProperties(
        @NotBlank(message = "Stripe API Key must not be empty")
        String apiKey,

        @NotBlank(message = "Stripe Webhook Secret must not be empty")
        String webhookSecret
) {}
