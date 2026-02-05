package com.smartentrance.backend.payment;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(
        name = "payment.stripe.enabled",  // property that controls loading
        havingValue = "true",
        matchIfMissing = false            // if property is missing, bean won't load
)
@RequiredArgsConstructor
public class StripeConfig {

    private final StripeProperties stripeProperties;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeProperties.apiKey();
    }
}