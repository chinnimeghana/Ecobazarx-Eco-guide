package com.ecobazar.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip JWT validation for public endpoints
        if (path.startsWith("/api/products")) {
            filterChain.doFilter(request, response);
            return;
        }

        // =============================
        // Put your JWT validation logic here
        // Example: check Authorization header, parse token, validate
        // If invalid, do: response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT");
        // =============================

        filterChain.doFilter(request, response);
    }
}
