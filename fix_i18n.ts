import fs from 'fs';

const p = './src/lib/i18n.ts';
let content = fs.readFileSync(p, 'utf8');

// The faulty insertion started at `\n  fi: {\n`
const faultTrigger = '\n  fi: {';
const index = content.indexOf(faultTrigger);

if (index !== -1) {
  // We need to cut everything from `\n  fi: {` to the end of the `kl: { ... }` block
  const beforeInject = content.substring(0, index);
  const afterInjectStart = content.substring(index);
  
  // Find where it ends. We injected `fi` to `kl`. `kl` ends with `\n  },`.
  const endIndex = afterInjectStart.lastIndexOf('\n  },') + 5; // length of '\n  },'
  
  const injectString = afterInjectStart.substring(0, endIndex);
  const rest = afterInjectStart.substring(endIndex);
  
  // Now we need to put injectString inside `translations`
  // `translations` ends at line 848 (in the clean file): `  }\n};\n`
  
  // We find `  }\n};\n\nexport const getTranslation`
  const target = '  }\n};\n\nexport const getTranslation';
  if (beforeInject.includes(target)) {
     const newBefore = beforeInject.replace('  }\n};\n\nexport const getTranslation', '  },' + injectString + '\n};\n\nexport const getTranslation');
     fs.writeFileSync(p, newBefore + rest);
     console.log("Fixed successfully");
  } else {
     console.log("Could not find target");
  }
} else {
  console.log("Could not find faultTrigger");
}
