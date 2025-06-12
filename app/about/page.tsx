import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, Users, Heart, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const teamMembers = [
  {
    name: "Ahmad Malik",
    role: "Founder & CEO",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Passionate about bringing world-class hospitality to Peshawar",
  },
  {
    name: "Fatima Khan",
    role: "Head of Operations",
    image: "/placeholder.svg?height=300&width=300",
    description: "Ensuring every guest experience exceeds expectations",
  },
  {
    name: "Hassan Ali",
    role: "Technology Director",
    image: "/placeholder.svg?height=300&width=300",
    description: "Building the future of hospitality technology in Pakistan",
  },
];

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "Every property is verified and every transaction is secure",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in hospitality",
  },
  {
    icon: Heart,
    title: "Authentic Hospitality",
    description: "Celebrating Pakistani culture and warm hospitality",
  },
  {
    icon: Users,
    title: "Community",
    description: "Supporting local businesses and creating opportunities",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-luxury-navy via-luxury-charcoal to-primary py-20 md:py-32">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=800&width=1600"
            alt="About PeshawarStays"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-6 bg-luxury-gold text-primary font-medium px-4 py-2">
              Our Story
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Redefining Hospitality in{" "}
              <span className="text-luxury-gold">Peshawar</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
              We're on a mission to showcase the finest accommodations Peshawar
              has to offer, connecting travelers with authentic luxury
              experiences in Pakistan's cultural heartland.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-luxury-gold text-primary">
                Founded in 2024
              </Badge>
              <h2 className="text-4xl font-bold text-primary mb-6">
                Our Journey Began with a Vision
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                PeshawarStays was born from a simple yet powerful idea: to
                create a platform that truly represents the luxury and
                hospitality that Peshawar has to offer. As a city rich in
                history, culture, and tradition, Peshawar deserved a modern
                platform that could showcase its finest accommodations to the
                world.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                We recognized that travelers seeking authentic experiences in
                Pakistan needed a trusted platform where they could discover
                verified, high-quality accommodations. From luxury hotels to
                boutique guest houses, we curate only the finest properties that
                meet our strict standards for comfort, service, and
                authenticity.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Today, we're proud to be the leading platform for luxury
                accommodations in Peshawar, serving thousands of satisfied
                guests and supporting local hospitality businesses in their
                growth journey.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="PeshawarStays Story"
                width={800}
                height={600}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-luxury-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-luxury-gold text-primary">
              Our Values
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              What Drives Us Forward
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our core values shape every decision we make and every experience
              we create
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={value.title}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <CardContent className="p-8">
                  <div className="bg-luxury-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-luxury-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-4">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-luxury-gold text-primary">
              Meet Our Team
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              The People Behind PeshawarStays
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our passionate team is dedicated to revolutionizing hospitality in
              Peshawar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={member.name}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center overflow-hidden"
              >
                <div className="relative">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-full h-80 object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {member.name}
                  </h3>
                  <p className="text-luxury-gold font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-luxury-gold mb-2">
                50+
              </h3>
              <p className="text-xl">Verified Properties</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-luxury-gold mb-2">
                1000+
              </h3>
              <p className="text-xl">Happy Guests</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-luxury-gold mb-2">
                4.8
              </h3>
              <p className="text-xl">Average Rating</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-luxury-gold mb-2">
                24/7
              </h3>
              <p className="text-xl">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-luxury-cream">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our community of travelers and hosts who are redefining
              hospitality in Peshawar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hotels">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold"
                >
                  Explore Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/become-host">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-semibold"
                >
                  Become a Host
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
