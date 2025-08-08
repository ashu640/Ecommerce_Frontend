import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserData } from '@/context/UserContext';
import { Loader } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [email, setEmail] = useState('');
  const { LoginUser, btnLoading } = UserData();
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  const submitHandler = () => {
    LoginUser(email, navigate);
  };

  return (
    <div className="min-h-[60vh]">
      <Card className="md:w-[400px] sm:w-[300px] m-auto mt-5">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label>{t("emailLabel")}</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button disabled={btnLoading} onClick={submitHandler}>
            {btnLoading ? <Loader /> : t("submitBtn")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
