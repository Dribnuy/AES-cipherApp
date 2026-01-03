import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { User, Code2, Sparkles, Shield, Zap, Globe } from "lucide-react";

export function AboutView() {
  const { t } = useTranslation();

  const techStack = [
    { name: "React", color: "from-blue-400 to-cyan-400" },
    { name: "TypeScript", color: "from-blue-500 to-blue-600" },
    { name: "Tailwind CSS", color: "from-cyan-400 to-blue-500" },
    { name: "Framer Motion", color: "from-purple-400 to-pink-400" },
  ];

  const features = [
    { icon: Shield, key: "feature1" },
    { icon: Zap, key: "feature2" },
    { icon: Sparkles, key: "feature3" },
    { icon: Globe, key: "feature5" },
    { icon: User, key: "feature6" },
  ];

  return (
    <div className="space-y-6">
      {/* інфа про автора */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/20 rounded-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          {/*фотка*/}
          <div className="w-24 h-24 rounded-full overflow-hidden border border-green-400/50 shadow-md">
            <img
              src="/author.jpg"
              alt={t("authorName")}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              {t("aboutAuthor")}
            </h2>
            <p className="text-lg font-semibold text-foreground">
              {t("authorName")}
            </p>
            <p className="text-sm text-muted-foreground">{t("authorGroup")}</p>
          </div>
        </div>
      </motion.div>

      {/* опис проєкта*/}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/50 border border-border rounded-lg p-6"
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("projectDescription")}
        </p>
      </motion.div>

      {/* стек */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/50 border border-border rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Code2 className="h-5 w-5 text-cyan-400" />
          {t("techStack")}
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border rounded-lg p-3 flex items-center gap-3"
            >
              <span className="text-2xl"></span>
              <span
                className={`text-sm font-medium bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}
              >
                {tech.name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* фічі */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card/50 border border-border rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-green-400" />
          {t("features")}
        </h3>

        <div className="space-y-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
            >
              <feature.icon className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">
                {t(feature.key)}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-xs text-muted-foreground pt-4"
      >
        <p>© 2025 AES FileCrypt • Cryptography Course Project</p>
      </motion.div>
    </div>
  );
}
