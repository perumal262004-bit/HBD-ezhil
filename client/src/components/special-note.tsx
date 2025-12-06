import { Card, CardContent } from "@/components/ui/card";

export default function SpecialNote() {
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 shadow-xl border border-border backdrop-blur-sm" data-testid="card-special-note">
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-primary mb-4 font-serif" data-testid="text-note-title">
            A Special Note That I Wrote For You
          </h3>
          <div className="space-y-3 text-foreground">
            <p className="leading-relaxed" data-testid="text-note-paragraph-1">
              Happy birthday to my dearest friend — you’re the best! 🎁🎉
            </p>
            <p className="leading-relaxed" data-testid="text-note-paragraph-2">
ஆயிரம் சொந்தம் நம்மை தேடி வரும்
ஆனால், தேடினாலும் கிடைக்காத ஒரே சொந்தம்
நல்ல நண்பர்கள்!     </p>
            <p className="leading-relaxed font-medium text-primary" data-testid="text-note-paragraph-3">
              நட்பின் புனித நூலை எழுதியவரே,
நல் வாழ்வு வாழ வாழ்த்துகிறேன்!
பூக்களாய் உன் நாட்கள் மலர,
இனிய பிறந்தநாள் வாழ்த்துகள் நண்பரே 🎁🎂💖✨
            </p>
          </div>
          <div className="mt-6 text-4xl" data-testid="text-note-emojis">🎉🎁🎂💖✨</div>
        </div>
      </CardContent>
    </Card>
  );
}
