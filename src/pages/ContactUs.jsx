// src/pages/ContactUs.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <Card className="w-full max-w-3xl shadow-lg rounded-2xl">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold mb-2 text-center text-gray-900">
            Contact Us
          </h1>
          <p className="text-center text-gray-600 mb-8">
            We’d love to hear from you. Reach us at:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Office Address */}
            <div className="flex items-start gap-3">
              <MapPin className="text-blue-600 mt-1" size={24} />
              <div>
                <h2 className="font-semibold text-lg text-gray-800">
                  Office Address
                </h2>
                <p className="text-gray-600">
                  B-9, College Street Market <br />
                  "Barna Parichay", 1st Floor <br />
                  Kolkata – 700007
                </p>
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="flex items-start gap-3">
              <Phone className="text-green-600 mt-1" size={24} />
              <div>
                <h2 className="font-semibold text-lg text-gray-800">Phone</h2>
                <p className="text-gray-600">Office: +91 99999999999</p>
                <p className="text-gray-600">Mobile: +91 123456789</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="text-red-600 mt-1" size={24} />
              <div>
                <h2 className="font-semibold text-lg text-gray-800">Email</h2>
                <a
                  href="mailto:email@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  quazihasin@gmail.com
                </a>
              </div>
            </div>

            {/* Website */}
            <div className="flex items-start gap-3">
              <Globe className="text-purple-600 mt-1" size={24} />
              <div>
                <h2 className="font-semibold text-lg text-gray-800">Website</h2>
                <a
                  href="http://www.biswabangiya.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  www.biswabangiya.com
                </a>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-10 flex justify-center">
            <Button
              onClick={() => (window.location.href = "mailto:quazihasin@gmail.com")}
              className="px-6 py-2 text-lg rounded-xl"
            >
              Send an Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactUs;
