"use client";
import React, { useState } from "react";

const stepNotifications = [
  "You have started contract negotiation.",
  "Requirements gathering in progress. Please upload documents.",
  "Proposal submitted. Awaiting review.",
  "Negotiation ongoing. Schedule a meeting.",
  "Agreement finalized. Download contract.",
];

export default function NegotiationNotifications({ currentStep }: { currentStep: number }) {
  return (
    <div className="mt-4 p-4 bg-yellow-100 rounded">
      <strong>Notification:</strong> {stepNotifications[currentStep]}
    </div>
  );
}
