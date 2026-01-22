package com.tajeats.tajeats_backend.exception;

public class AccountPendingApprovalException extends RuntimeException {
    public AccountPendingApprovalException(String message) {
        super(message);
    }
}
